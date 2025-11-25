import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {  useRef } from "react";



export const Deteils = () => {

  const router = useRouter();
  const modalRef = useRef(null);

  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div>Deteils</div>
  )
}
