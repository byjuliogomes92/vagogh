import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) return null

  const pageNumbers = []
  const maxVisiblePages = 5

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push("...")
      pageNumbers.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1)
      pageNumbers.push("...")
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      pageNumbers.push("...")
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push("...")
      pageNumbers.push(totalPages)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="bg-[#1E293B] text-white hover:bg-[#2C3E50] border-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pageNumbers.map((number, index) => (
        <React.Fragment key={index}>
          {number === "..." ? (
            <span className="px-2">...</span>
          ) : (
            <Button
              variant={currentPage === number ? "default" : "outline"}
              onClick={() => onPageChange(number as number)}
              className={
                currentPage === number
                  ? "bg-[#0055FF] text-white"
                  : "bg-[#1E293B] text-white hover:bg-[#2C3E50] border-gray-700"
              }
            >
              {number}
            </Button>
          )}
        </React.Fragment>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="bg-[#1E293B] text-white hover:bg-[#2C3E50] border-gray-700"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

