"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { SubmitButton } from "./submit-button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  // Ferme le modal lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = () => {
    onConfirm();
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-center flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-black p-6 rounded-xl shadow-xl max-w-md w-full border"
      >
        <p className="mb-6  ">
          Voulez-vous vraiment supprimer cet élément? <br />
          Cette action est irréversible.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center space-x-3"
        >
          <button
            onClick={onClose}
            className="px-4 py-2 bg-none border rounded-md hover:border-rose-500 hover:text-rose-500 transition-colors"
          >
            Annuler
          </button>
          <SubmitButton
            isSubmitting={isSubmitting}
            defaultText="Confirmer la suppression"
            loadingText="Suppression en cours..."
          />
        </form>
      </div>
    </div>
  );
};
