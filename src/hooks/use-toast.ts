
import { useToast as useShadToast } from "@/components/ui/use-toast";
import { toast as shadToast } from "@/components/ui/use-toast";

export const useToast = useShadToast;
export const toast = shadToast;

export default useToast;
