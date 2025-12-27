import { prisma } from "@/lib/db"

export async function generateRequestNumber(): Promise<string> {
  const year = new Date().getFullYear()

  // Get the last request number for this year
  const lastRequest = await prisma.maintenanceRequest.findFirst({
    where: {
      requestNumber: {
        startsWith: `MR-${year}-`,
      },
    },
    orderBy: {
      requestNumber: "desc",
    },
  })

  let sequence = 1
  if (lastRequest) {
    const lastSequence = Number.parseInt(lastRequest.requestNumber.split("-")[2])
    sequence = lastSequence + 1
  }

  return `MR-${year}-${sequence.toString().padStart(4, "0")}`
}
