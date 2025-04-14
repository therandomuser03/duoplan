import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type PermissionLevel = 'private' | 'view' | 'edit'

export function EventPermissions({
  defaultPermissions,
  onUpdate
}: {
  defaultPermissions: {
    level: PermissionLevel
    sharedWith?: string[]
  }
  onUpdate: (permissions: {
    level: PermissionLevel
    sharedWith?: string[]
  }) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Sharing Permissions</Label>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="private" 
              checked={defaultPermissions.level === 'private'}
              onCheckedChange={() => onUpdate({ level: 'private' })}
            />
            <Label htmlFor="private">Private (Only me)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="view"
              checked={defaultPermissions.level === 'view'}
              onCheckedChange={() => onUpdate({ level: 'view' })}
            />
            <Label htmlFor="view">View-only</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="edit"
              checked={defaultPermissions.level === 'edit'}
              onCheckedChange={() => onUpdate({ level: 'edit' })}
            />
            <Label htmlFor="edit">Editable</Label>
          </div>
        </div>
      </div>

      {defaultPermissions.level !== 'private' && (
        <div className="space-y-2">
          <Label>Share With Partner</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Select Partner
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}