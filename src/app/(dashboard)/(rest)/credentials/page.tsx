import { Suspense } from "react";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import {
  CredentialsContainer,
  CredentialsError,
  CredentialsList,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";
import { prefetchcredentials } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);
  prefetchcredentials(params);

  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  );
};
export default Page;
