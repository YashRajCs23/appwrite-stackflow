import { databases } from "@/lib/appwrite";
import { answerCollection, db } from "@/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import { users } from "@/models/server/config";
export async function POST(request: NextRequest) {
    try {
        const {questionId,answer,authorId} =await request.json();
        const response=await databases.createDocument(db,answerCollection,ID.unique(),{
            content:answer,
            authorId:authorId,
            questionId:questionId,
        })
        //increase author reputation
        const prefs=await users.getPrefs<UserPrefs>(authorId)
        await users.updatePrefs<UserPrefs>(authorId,{
            reputation: Number(prefs?.reputation) + 1
        })

        return NextResponse.json(response,{
            status:201
        })

    } catch (error:any) {
        return NextResponse.json({
            error: error?.message || "error creating answer",
        }),{
            status: error?.status || error?.code ||500
        }
    }
}

export async function DELETE(request:NextRequest) {
    try {
        const {answerId}=await request.json();

        const answer=await databases.getDocument(db,answerCollection,answerId);

        const response=await databases.deleteDocument(db,answerCollection,answerId);

        ///decrease author reputation
         const prefs=await users.getPrefs<UserPrefs>(answer.authorId)
            await users.updatePrefs<UserPrefs>(answer.authorId,{
                reputation: Number(prefs?.reputation) - 1
        })

            return NextResponse.json(
                {data:response},
                {status:200}
            )


    } catch (error:any) {
        return NextResponse.json({
            message: error?.message || "error deleting answer",
        }),{
            status: error?.status || error?.code ||500
        }
    }
    
}