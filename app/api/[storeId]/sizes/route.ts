import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
){ 
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Nabel is required is required", { status: 400 });
        }

        if(!value) {
            return new NextResponse("Value URL is required is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);

    } catch (error) {
       console.log('[SIZES_POST]', error);
       return new NextResponse("Internal error", { status: 500 });
    }   
};

// getting all the sizes

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
){ 
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID is required is required", { status: 400 });
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(sizes);

    } catch (error) {
       console.log('[SIZES_GET]', error);
       return new NextResponse("Internal error", { status: 500 });
    }   
};

export const runtime = "nodejs"