import { NextRequest, NextResponse } from "next/server";
import { desc, asc } from "drizzle-orm";

import { db } from "@/database";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "desc";

    // Validate sort parameter
    if (!["asc", "desc"].includes(sort)) {
      return NextResponse.json(
        { message: "Invalid sort parameter. Must be 'asc' or 'desc'" },
        { status: 400 }
      );
    }

    // Export ALL leads - ignore filters to get complete dataset
    const leadEntries = await db.query.leads.findMany({
      orderBy: (fields) => {
        return sort === "asc"
          ? [asc(fields.createdAt)]
          : [desc(fields.createdAt)];
      },
      with: {
        perk: {
          columns: {
            id: true,
            title: true,
            slug: true,
            vendorName: true
          }
        }
      }
    });

    // Generate CSV headers
    const csvHeaders = [
      "Lead ID",
      "Perk Title",
      "Perk Vendor",
      "Submission Date",
      "IP Address",
      "Form Data"
    ];

    // Generate CSV rows
    const csvRows = leadEntries.map((lead) => {
      const formData = lead.data
        ? Object.entries(lead.data)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join(" | ")
        : "";

      return [
        lead.id,
        lead.perk?.title || "Unknown Perk",
        lead.perk?.vendorName || "-",
        lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "-",
        lead.ip || "-",
        `"${formData}"`
      ];
    });

    // Create CSV content
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(","))
    ].join("\n");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `leads-export-${timestamp}.csv`;

    // Return CSV file directly with proper headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
