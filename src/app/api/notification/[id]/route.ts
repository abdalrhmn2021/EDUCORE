import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/moongodb";
import Notification from "@/modles/Notification";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await dbConnect();

    const notification = await Notification.findByIdAndUpdate(
      { _id: id, userId: session.userId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (err) {
    console.error("Notification update error:", err);
    return NextResponse.json(
      { error: "Error updating notification" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    await dbConnect();

    const result = await Notification.deleteOne({
      _id: id,
      userId: session.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "الاشعار غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification delete error:", error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
