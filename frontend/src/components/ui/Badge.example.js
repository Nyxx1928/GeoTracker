import React from 'react';
import Badge from './Badge';
import { Shield, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Badge Component Examples
 * 
 * This file demonstrates the usage of the refactored Badge component
 * with shadcn/ui primitives, including variant mapping and icon support.
 */

export const BadgeExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Variant Mapping (Backward Compatible)</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="safe">Safe (→ success)</Badge>
          <Badge variant="caution">Caution (→ warning)</Badge>
          <Badge variant="danger">Danger (→ destructive)</Badge>
          <Badge variant="info">Info (→ default)</Badge>
          <Badge variant="neutral">Neutral (→ secondary)</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">New shadcn Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Size Variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Badge size="sm">Small Badge</Badge>
          <Badge size="md">Medium Badge</Badge>
          <Badge size="lg">Large Badge</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">With Icons (lucide-react)</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
            Low Risk
          </Badge>
          <Badge variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
            Medium Risk
          </Badge>
          <Badge variant="destructive" icon={<AlertTriangle className="h-3 w-3" />}>
            High Risk
          </Badge>
          <Badge variant="default" icon={<Info className="h-3 w-3" />}>
            Information
          </Badge>
          <Badge variant="secondary" icon={<Shield className="h-3 w-3" />}>
            Protected
          </Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Combined: Size + Icon + Variant</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Badge size="sm" variant="success" icon={<CheckCircle className="h-3 w-3" />}>
            Small Success
          </Badge>
          <Badge size="md" variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
            Medium Warning
          </Badge>
          <Badge size="lg" variant="destructive" icon={<AlertTriangle className="h-3 w-3" />}>
            Large Danger
          </Badge>
        </div>
      </section>
    </div>
  );
};

export default BadgeExamples;
