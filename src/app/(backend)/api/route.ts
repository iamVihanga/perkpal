import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    // Example data to return
    const data = {
      message: "Hello from the API!",
      status: "success",
      timestamp: new Date().toISOString()
    };

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    // Parse the request body
    const body = await request.json();

    // Process the data (this is where you'd add your business logic)
    const processedData = {
      received: body,
      processed: true,
      timestamp: new Date().toISOString()
    };

    // Return the response
    return NextResponse.json(processedData);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
