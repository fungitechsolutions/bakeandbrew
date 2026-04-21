"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form-nextjs";
import { LoginInput, loginInputSchema, LoginResponse } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, apiFetch, mapFieldErrors } from "@/utils/api";
import { useRouter } from "next/navigation";

type FieldErrors = Partial<Record<keyof LoginInput, string>>;
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [errors, setErrors] = useState<FieldErrors>();
  const router = useRouter()
  const { mutate, isPending, reset } = useMutation({
    mutationFn: async (data: LoginInput) => {
      return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (result: LoginResponse) => {
      toast.success(result.message);
      router.replace("/admin")
      reset();
    },
    onError: (error: ApiError) => {

      if (error.errors) {
        setErrors(mapFieldErrors(error));
      }

      toast.error(
        error.message || "An unexpected error occurred. Please try again.",
      );

      reset();
    },
  });

  const { Field: FormField, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    // validators: {
    //   onSubmit: loginInputSchema,
    // },

    onSubmit: ({ value }) => mutate(value),
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <FormField name="email">
          {(field) => {
            const error = field.state.meta.errors[0]??"";
            return (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  placeholder="m@example.com"
                  required
                />

                {error ||
                  (errors && (
                    <FieldError>{errors ? errors.email : error}</FieldError>
                  ))}
              </Field>
            );
          }}
        </FormField>
        <FormField name="password">
          {(field) => {
            const error = field.state.meta.errors[0] ?? "";
            return (
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  required
                />

                {error ||
                  (errors && (
                    <FieldError>{errors ? errors.password : error}</FieldError>
                  ))}
              </Field>
            );
          }}
        </FormField>
        <Field>
          <Button disabled={isPending} type="submit">
            {isPending ? <Spinner /> : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
