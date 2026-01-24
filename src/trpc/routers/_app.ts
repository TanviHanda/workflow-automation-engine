import {createTRPCRouter} from '../init';
import { workflowsRouter } from '@/features/auth/components/workflows/server/router';
export const appRouter = createTRPCRouter({
    workflows: workflowsRouter,
  })
export type AppRouter = typeof appRouter;

//.query -> a get api call
//.mutation -> a post api call