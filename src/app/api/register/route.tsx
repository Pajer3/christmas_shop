import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { ConnectMongoDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, password, email, phone, action } = await req.json();

    await ConnectMongoDb();

    if (action === 'register') {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        password: hashedPassword,
        email,
        phone,
      });

      console.log("User created:", user);

      return NextResponse.json({ message: "User registered" }, { status: 201 });

    } else if (action === 'update') {
      const updateData: any = {};

      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (phone) updateData.phone = phone;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const updatedUser = await User.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      console.log("User updated:", updatedUser);

      return NextResponse.json({ message: "User updated", user: updatedUser }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Error during user operation:", error);

    return NextResponse.json(
      { message: "An error occurred during the operation" },
      { status: 500 }
    );
  }
}
