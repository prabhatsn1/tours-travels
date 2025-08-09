import { NextResponse } from "next/server";
import { checkDatabaseHealth, getConnectionStatus } from "@/lib/mongodb";

/**
 * GET /api/health - Check database connection status
 */
export async function GET() {
  try {
    const isHealthy = await checkDatabaseHealth();
    const connectionStatus = getConnectionStatus();

    return NextResponse.json({
      success: true,
      data: {
        database: {
          connected: isHealthy,
          status: connectionStatus,
          timestamp: new Date().toISOString(),
        },
        api: {
          status: "operational",
          version: "1.0.0",
        },
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Health check failed",
        data: {
          database: {
            connected: false,
            status: "error",
            timestamp: new Date().toISOString(),
          },
          api: {
            status: "error",
            version: "1.0.0",
          },
        },
      },
      { status: 500 }
    );
  }
}
