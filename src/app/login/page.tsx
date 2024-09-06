"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .email("E-mail inválido")
    .regex(/@alu.ufc.br$/, "E-mail deve ser institucional")
    .min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

type Schema = z.infer<typeof schema>;

export default function Login() {
  const [loginFailed, setLoginFailed] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: Schema) => {
    const isValidLogin = await simulateLogin(data);

    if (isValidLogin) {
      setLoginFailed(false);
      console.log("Login bem-sucedido");
      router.push("/");
    } else {
      setLoginFailed(true);
    }
  };

  const simulateLogin = async (data: Schema) => {
    // Simulando uma verificação de credenciais
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Simule uma verificação de login usando 'data'
        const isValid =
          data.email === "teste@alu.ufc.br" && data.password === "testes";
        resolve(isValid);
      }, 1000);
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mr-16 h-[570px] w-60 bg-slate-600" />

      <div className="flex gap-8">
        <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border-2 px-8 pt-9 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-28">
            <div>
              <h1 className="font-semibold text-[32px] text-slate-900">
                Login
              </h1>

              <p className="pt-3 text-base">Que bom receber você novamente!</p>

              <div className="pt-10">
                <Label className="text-[14px] text-slate-900">
                  E-mail Institucional
                </Label>

                <Input
                  className={`mt-3 w-[356px] border-2 text-base placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500 ${
                    loginFailed || errors.email ? "border-red-800" : ""
                  }`}
                  type="text"
                  placeholder="Insira seu e-mail"
                  {...register("email")}
                  onBlur={() => trigger("email")}
                />
              </div>

              <div className="pt-6">
                <Label className="text-[14px] text-slate-900">Senha</Label>

                <Input
                  className={`mt-3 w-[356px] border-2 text-base placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500 ${
                    loginFailed || errors.password ? "border-red-800" : ""
                  }`}
                  type="password"
                  placeholder="Insira sua senha"
                  {...register("password")}
                  onBlur={() => trigger("password")}
                />
                <p className="pt-3 text-slate-600 text-xs">
                  Pelo menos 6 caracteres
                </p>
              </div>

              {/* Mensagem de erro genérica */}
              {loginFailed && (
                <div className="flex items-center gap-3 pt-3">
                  <CircleAlert className="h-4 w-4 text-red-800" />
                  <p className=" text-red-800 text-sm">Credenciais inválidas</p>
                </div>
              )}
            </div>

            <div>
              <Button
                type="submit"
                disabled={!isValid}
                className={`w-[356px] rounded-md bg-slate-700 py-2 text-slate-100 ${
                  isValid ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                Login
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/register")}
                className="mt-4 w-[356px] rounded-md bg-slate-200 py-2 text-slate-600"
              >
                Criar uma Conta
              </Button>
            </div>
          </form>
        </div>
        <div className="mr-16 h-[570px] w-60 bg-slate-600" />
      </div>
    </main>
  );
}
