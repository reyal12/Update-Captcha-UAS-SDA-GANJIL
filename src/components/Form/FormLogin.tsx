"use client";

import { Eye, EyeClosed, Mail, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { useActionState, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { formValidationLogin } from "@/lib/formvalidation";
import { MixinAlert } from "@/lib/alert";
import ButtonLoading from "../ui/buttonLoading";
import { useRouter } from "next/navigation";

const FormLogin = () => {
  const [eyeClosed, setEyeClosed] = useState<boolean>(true);
  const [captchaText, setCaptchaText] = useState<string>("");
  const [userCaptcha, setUserCaptcha] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, formAction] = useActionState(formValidationLogin, null);
  const router = useRouter();

  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    setUserCaptcha("");
    setCaptchaError("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (userCaptcha !== captchaText) {
      setCaptchaError("Captcha tidak sesuai");
      generateCaptcha();
      setIsLoading(false);
      return;
    }

    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formAction(formData);
    });
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (state?.type && state?.message) {
      MixinAlert(
        state?.type as "error" | "warning" | "info" | "success",
        state?.message
      );
      if (state?.type === "success") {
        router.push("/dashboard");
      }
      generateCaptcha();
    }
  }, [state, router]);

  return (
    <form onSubmit={handleSubmit}>
      <section className="my-4">
        <label className="">Email</label>
        <section className="relative">
          <Mail className="absolute top-5 left-2 -translate-y-1/2" />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="ps-10"
          />
          <p
            aria-live="polite"
            className={`${state?.error?.email && "text-red-500"} text-xs my-1`}
          >
            {state?.error?.email ? state.error.email : "Email is required"}
          </p>
        </section>
      </section>

      <section className="my-4">
        <label>Password</label>
        <section className="relative">
          {eyeClosed ? (
            <EyeClosed
              className="absolute top-5 left-2 -translate-y-1/2 cursor-pointer"
              onClick={() => setEyeClosed(!eyeClosed)}
            />
          ) : (
            <Eye
              className="absolute top-5 left-2 -translate-y-1/2 cursor-pointer"
              onClick={() => setEyeClosed(!eyeClosed)}
            />
          )}
          <Input
            type={eyeClosed ? "password" : "text"}
            name="password"
            placeholder="Password"
            className="ps-10"
          />
          <p
            aria-live="polite"
            className={`${state?.error?.password && "text-red-500"} text-xs my-1`}
          >
            {state?.error?.password
              ? state.error.password
              : "Password is required"}
          </p>
        </section>
      </section>

      <section className="my-4">
        <label>Verifikasi Captcha</label>
        <section className="bg-gray-100 p-4 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-mono tracking-widest bg-white px-4 py-2 rounded">
              {captchaText}
            </div>
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <Input
            type="text"
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
            placeholder="Masukkan captcha di atas"
            className="mt-2"
          />
          {captchaError && (
            <p className="text-red-500 text-xs mt-1">{captchaError}</p>
          )}
        </section>
      </section>

      <section className="my-4">
        <ButtonLoading 
          className="bg-slate-900 text-slate-200 w-full"
          
        >
          Login
        </ButtonLoading>
      </section>

      <p className="text-center text-slate-700 text-sm my-4">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="text-slate-900 poppins-semibold cursor-pointer"
        >
          Daftar
        </Link>
      </p>
    </form>
  );
};

export default FormLogin;
