// src/components/AddPlanModal.tsx
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Info, Star } from "lucide-react";
import { toast } from "sonner";
import { Plan } from "@/type/ownerMemberShipPlan";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createMembershipPlanfeth, updateMembershipPlanfeth } from "@/store/ownerMembershipPlan/ownerMembershipPlanThunk";


const schema = yup.object().shape({
  planName: yup.string().required("Plan name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),
  duration: yup
    .number()
    .typeError("Duration must be a number")
    .required("Duration is required")
    .min(1, "Duration must be at least 1 month")
    .max(12, "Duration cannot exceed 12 months")
    .integer("Duration must be a whole number"),
  features: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Feature cannot be empty")
    })
  ).optional(),
  isPopular: yup.boolean().optional(),
});

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPlan?: Plan;
}

const AddPlanModal = ({ isOpen, onClose, editPlan }: AddPlanModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  console.log("editPlan:", editPlan);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Plan>({
    resolver: yupResolver(schema),
    defaultValues: {
      planName: "",
      price: 0,
      duration: 1,
      features: [],
      isPopular: false,
    },
  });

  // Watch the isPopular field
  const isPopular = watch("isPopular");

  // Update form when editPlan changes
  useEffect(() => {
    if (editPlan) {
      const featuresArray = editPlan.features.map(feature => ({ value: feature.featureName }));
      reset({
        planName: editPlan.planName,
        price: editPlan.price,
        duration: editPlan.duration,
        features: editPlan.features ? featuresArray : [],
        isPopular: editPlan.isPopular,
      });
    } else {
      reset({
        planName: "",
        price: 0,
        duration: 1,
        features: [],
        isPopular: false,
      });
    }
  }, [editPlan, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const onSubmit = async (data: Plan) => {
    // Filter out empty features before submitting
    const features = data.features
      ? data.features
          .map((feature) => feature.value)
          .filter((value) => value.trim() !== "")
      : [];

    const reqData = {
      planName: data.planName,
      price: data.price,
      duration: data.duration,
      features,
      isPopular: data.isPopular,
    };
    if(editPlan){
      // If editing, include the plan ID
        (reqData as any).planId = editPlan.id;
        console.log("reqDataupdate:", reqData);
        await dispatch(updateMembershipPlanfeth(reqData));
    }else{
      // If creating new, ensure no ID is sent
       await dispatch(createMembershipPlanfeth(reqData));
    }
    reset();
    onClose();
  };

  const handleAddFeature = () => {
    append({ value: "" });
  };

  const handleRemoveFeature = (index: number) => {
    remove(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white max-w-[90vw] sm:max-w-[425px] rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-2 border-b border-slate-700">
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <Star className="h-4 w-4" />
            </div>
            {editPlan ? "Edit Membership Plan" : "Add Membership Plan"}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            {editPlan ? "Edit an existing membership plan" : "Create a new membership plan for your gym"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-grow pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="planName" className="text-slate-300 font-medium text-sm flex items-center gap-1">
                Plan Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="planName"
                {...register("planName")}
                className="bg-slate-700/50 border-slate-600 text-white focus:border-orange-500 transition-colors h-9"
                placeholder="e.g., Basic, Standard"
              />
              {errors.planName && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {errors.planName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-slate-300 font-medium text-sm flex items-center gap-1">
                  Price ($) <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 text-sm">
                    $                  
                  </div>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === 'e' || e.key === "E") {
                        e.preventDefault();
                      }
                    }}
                    {...register("price", { valueAsNumber: true })}
                    className="bg-slate-700/50 border-slate-600 text-white focus:border-orange-500 transition-colors pl-7 h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="duration" className="text-slate-300 font-medium text-sm flex items-center gap-1">
                  Duration (months) <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="12"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === 'e' || e.key === "E" || e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                  {...register("duration", { valueAsNumber: true })}
                  className="bg-slate-700/50 border-slate-600 text-white focus:border-orange-500 transition-colors h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="1-12"
                />
                {errors.duration && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPopular" className="text-slate-300 font-medium text-sm flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-orange-400" />
                  Mark as Popular
                </Label>
                <Switch
                  id="isPopular"
                  checked={isPopular}
                  onCheckedChange={(checked) => {
                    setValue("isPopular", checked);
                  }}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>
              <p className="text-xs text-slate-400 flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>Popular plans will be highlighted to attract more members</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300 font-medium text-sm">
                  Features
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddFeature}
                  className="text-orange-500 hover:text-orange-400 hover:bg-slate-700/50 h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              {fields.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 group">
                      <Input
                        {...register(`features.${index}.value`)}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-orange-500 transition-colors h-8 text-sm"
                        placeholder="e.g., Gym access"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-700/50 opacity-70 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No features added. Click "Add" to include features.</p>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="pt-3 flex flex-col sm:flex-row gap-2 border-t border-slate-700">
          <Button
            type="button"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 w-full sm:w-auto transition-all"
            onClick={handleSubmit(onSubmit)}
          >
            {editPlan ? "Update Plan" : "Add Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanModal;