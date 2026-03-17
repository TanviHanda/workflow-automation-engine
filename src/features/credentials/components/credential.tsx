"use client";

import z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useCreateCredential,
  useSuspenseCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/browser";
import { useUpgradeModal } from "@/hooks/use-upgrade-model";
import Link from "next/link";

// 1. Form Schema define karna
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API Key is required"),
});

type FormValues = z.infer<typeof formSchema>;

// 2. Logo mapping ke liye Options
const credentialTypeOptions = [
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/logos/gemini.svg",
  },
] as const;

interface CredentialFormProps {
  initialData?: {
    id: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();
  const { handleError } = useUpgradeModal();

  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();

  const isEdit = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.GEMINI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        await updateCredential.mutateAsync({
          id: initialData!.id,
          ...values,
        });
      } else {
        await createCredential.mutateAsync(values, {
          onSuccess: (data) => {
            router.push(`/credentials/${data.id}`);
          },
          onError: (error) => {
            error;
          },
        });
      }

      router.push("/credentials");
      router.refresh();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Credential" : "Create Credential"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your API key details."
            : "Add a new API key to use in your credentials."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Selector (Select with Icons) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-3 p-3 border rounded-md bg-muted/20 grayscale-0">
                      <Image
                        src="/logos/gemini.svg"
                        alt="Gemini"
                        width={24}
                        height={24}
                        className="shrink-0"
                      />
                      <span className="font-medium text-sm text-foreground">
                        Google Gemini
                      </span>
                      <input type="hidden" {...field} value="GEMINI" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* API Value (Password Input) */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="sk-..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={
                  createCredential.isPending || updateCredential.isPending
                }
              >
                {isEdit ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                // onClick={() => router.push("/credentials")}
                asChild
              >
                <Link href="/credentials">Cancel</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
};
