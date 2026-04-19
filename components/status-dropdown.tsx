import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function StatusDropdown({ className }: { className?: string }) {
  return (
    <div className={cn("mb-4 mt-4", className)}>
      <Select defaultValue="invoice">
        <SelectTrigger className="h-9 w-[140px] rounded-lg border-zinc-200/90 bg-white/80 text-xs font-medium shadow-sm backdrop-blur-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="invoice">Invoice</SelectItem>
          <SelectItem value="quotation">Quotation</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
