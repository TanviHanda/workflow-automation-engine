import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';
import { useCredentialsParams } from './use-credentials-params';
import { CredentialType } from '@/generated/prisma/enums';

// hook to fetch all credentials using suspense 
export const useSuspenseCredentials = () => {
    const trpc = useTRPC();
    const [params] = useCredentialsParams();
    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
}

// hook to create a new credential
export const useCreateCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.credentials.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" created`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}),
            );
            },
            onError: (error) => {
                toast.error(`Failed to create credential: ${error.message}`)
            },
        }),
    );
};

// Hook to remove a credential

export const useRemoveCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryOptions({id: data.id})
                )
            }
        })
    )
}

// hook to fetch a single credential using suspense

export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({id}));
}

// hook to update a credential

export const useUpdateCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.credentials.update.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" saved`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}),
            );
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryOptions({id: data.id})
                )
            },
            onError: (error) => {
                toast.error(`Failed to save credential: ${error.message}`)
            },
        }),
    );
};

// hook to fetch credentials by type
export const useCredentialsByType = (type: CredentialType) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credentials.getByType.queryOptions({ type }));
};
