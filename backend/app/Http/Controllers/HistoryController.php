<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LookupHistory;

/**
 * HistoryController - Manages user lookup history CRUD operations.
 * 
 * This controller handles all operations related to a user's saved lookup history:
 * - Retrieving history (GET /api/history)
 * - Viewing a single public lookup (GET /api/lookup/{uuid})
 * - Updating labels (PATCH /api/history/{id})
 * - Deleting single records (DELETE /api/history/{id})
 * - Deleting all records (DELETE /api/history)
 * 
 * Key Security Principle: Ownership Authorization
 * - All authenticated endpoints verify that the record belongs to the current user
 * - Public lookup endpoint (/api/lookup/{uuid}) is intentionally unauthenticated
 * - We use Laravel's authorization policies to enforce ownership
 */
class HistoryController extends Controller
{
    /**
     * Get the authenticated user's lookup history.
     * 
     * Returns the 50 most recent lookups ordered by created_at descending.
     * This gives users a quick view of their recent investigations.
     * 
     * Teaching Point: We use Eloquent's query builder methods to keep this clean.
     * The forUser() scope is defined in the LookupHistory model, making this
     * controller code very readable and maintainable.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Fetch user's history using the model's query scopes
        $history = LookupHistory::forUser($user->id)
            ->recent(50)
            ->get();
        
        return response()->json([
            'data' => $history,
            'meta' => [
                'total' => $history->count(),
                'per_page' => 50,
            ],
        ]);
    }

    /**
     * Get a single lookup by UUID (public, no authentication required).
     * 
     * This endpoint powers the shareable public lookup URLs.
     * Anyone with the UUID can view the full lookup result without logging in.
     * 
     * Teaching Point: This is intentionally unauthenticated to enable sharing.
     * The UUID acts as a "secret" - it's long enough (36 characters) that
     * it's practically impossible to guess. This is called "security through
     * unguessability" or "capability-based security".
     * 
     * @param string $uuid
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $uuid)
    {
        $lookup = LookupHistory::where('uuid', $uuid)->first();
        
        if (!$lookup) {
            return response()->json([
                'error' => true,
                'message' => 'Lookup not found',
            ], 404);
        }
        
        return response()->json($lookup);
    }

    /**
     * Update a lookup's label.
     * 
     * Users can add custom labels to remember why they looked up a target.
     * For example: "Suspicious login attempt" or "Customer support ticket #1234"
     * 
     * Teaching Point: We validate ownership before allowing the update.
     * This prevents users from modifying other users' records.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $user = $request->user();
        
        // Validate the label field
        $validated = $request->validate([
            'label' => 'required|string|max:100',
        ]);
        
        // Find the lookup and verify ownership
        $lookup = LookupHistory::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$lookup) {
            return response()->json([
                'error' => true,
                'message' => 'Lookup not found or you do not have permission to update it',
            ], 403);
        }
        
        // Update the label
        $lookup->label = $validated['label'];
        $lookup->save();
        
        return response()->json($lookup);
    }

    /**
     * Delete a single lookup record.
     * 
     * Users can delete individual lookups from their history.
     * This is useful for cleaning up test lookups or removing sensitive data.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, int $id)
    {
        $user = $request->user();
        
        // Find the lookup and verify ownership
        $lookup = LookupHistory::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$lookup) {
            return response()->json([
                'error' => true,
                'message' => 'Lookup not found or you do not have permission to delete it',
            ], 403);
        }
        
        $lookup->delete();
        
        return response()->json([
            'message' => 'Lookup deleted successfully',
        ]);
    }

    /**
     * Delete all lookup records for the authenticated user.
     * 
     * This is a "nuclear option" for users who want to clear their entire history.
     * We return the count of deleted records so users know what happened.
     * 
     * Teaching Point: We use deleteCount to track how many records were deleted.
     * This provides feedback to the user and helps with debugging.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyAll(Request $request)
    {
        $user = $request->user();
        
        // Delete all lookups for this user
        $deletedCount = LookupHistory::where('user_id', $user->id)->delete();
        
        return response()->json([
            'message' => 'All lookups deleted successfully',
            'deleted_count' => $deletedCount,
        ]);
    }
}

