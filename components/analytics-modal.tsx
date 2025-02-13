import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Bookmark, Share2, UserCheck, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  viewCount: number
  saveCount: number
  shareCount: number
  applyCount: number
}

const AnalyticItem = ({
  icon: Icon,
  label,
  value,
  color,
}: { icon: any; label: string; value: number; color: string }) => (
  <motion.div
    className={`bg-[#2C3E50] p-4 rounded-lg shadow-lg`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-2">
      <Icon className={`w-6 h-6 ${color}`} />
      <span className={`text-2xl font-bold ${color}`}>{isNaN(value) ? 0 : value}</span>
    </div>
    <p className="text-sm text-gray-400">{label}</p>
  </motion.div>
)

export function AnalyticsModal({
  isOpen,
  onClose,
  jobTitle,
  viewCount,
  saveCount,
  shareCount,
  applyCount,
}: AnalyticsModalProps) {
  const totalInteractions = (viewCount || 0) + (saveCount || 0) + (shareCount || 0) + (applyCount || 0)
  const engagementRate = viewCount > 0 ? (((saveCount + shareCount + applyCount) / viewCount) * 100).toFixed(1) : "0.0"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1E293B] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Dados de <span className="text-[#F7D047]">{jobTitle}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <AnalyticItem icon={Eye} label="Views" value={viewCount} color="text-blue-400" />
          <AnalyticItem icon={Bookmark} label="Saves" value={saveCount} color="text-green-400" />
          <AnalyticItem icon={Share2} label="Shares" value={shareCount} color="text-yellow-400" />
          <AnalyticItem icon={UserCheck} label="Applications" value={applyCount} color="text-purple-400" />
        </div>
        <div className="bg-[#2C3E50] p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#F7D047]" />
            Overall Performance
          </h3>
          <p className="text-sm text-gray-400 mb-1">
            Total Interactions: <span className="text-white font-semibold">{totalInteractions}</span>
          </p>
          <p className="text-sm text-gray-400">
            Engagement Rate: <span className="text-white font-semibold">{engagementRate}%</span>
          </p>
          <div className="mt-2 bg-gray-700 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${engagementRate}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

