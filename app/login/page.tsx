"use client";

import Link from "next/link";
import { login } from "./actions";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../components/submit-button";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    await login(formData);
  };

  return (
    <div className="justify-center items-center p-10 py-20 flex flex-col">
      <div className="text-rose-500 w-full md:w-[500px] text-left border border-rose-500 p-10 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 mb-10">
            {/* Mail */}
            <label htmlFor="email">Adresse e-mail</label>
            <input
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Adresse e-mail invalide",
                },
              })}
              className="appearance-none text-sm font-light border-rose-500 block w-full text-rose-500 border rounded py-3 px-4 leading-tight focus:outline-none focus:text-rose-500"
              id="email"
              type="email"
              placeholder="Tapez votre adresse e-mail"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}

            {/* Password */}
            <label htmlFor="password">Mot de passe</label>
            <input
              {...register("password", {
                required: "Le mot de passe est requis",
              })}
              className="appearance-none text-sm font-light border-rose-500 block w-full text-rose-500 border rounded py-3 px-4 leading-tight focus:outline-none focus:text-rose-500"
              id="password"
              type="password"
              placeholder="Tapez votre mot de passe"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="w-full justify-center flex flex-wrap gap-4">
            <SubmitButton
              defaultText="Se connecter"
              loadingText="Connexion..."
              isSubmitting={isSubmitting}
            />

            <div className="items-center rounded-full  hover:underline underline-offset-8 p-2">
              <Link href="/signup">Pas encore inscrit-e?</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
