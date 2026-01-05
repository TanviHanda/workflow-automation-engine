import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    //fetching the video
    await step.sleep("fetching","5s")
    // transcribing 
    await step.sleep("transcribing","5s")
    // sending transcription to AI
    await step.sleep("wait-a-moment","5s")

    await step.run("sending-to-ai",()=>{
      return prisma.workflow.create({
        data:{
          name:"workflow-from-inngest"
        }
      })
    })
  },
);