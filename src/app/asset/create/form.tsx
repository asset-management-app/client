import React, { useState } from 'react'
import  {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@components/ui/form";
import { useLoading } from "@providers/loading";
import { useMutation } from "@apollo/client";
import { CREATE_ASSET_MUTATION } from "@services/query/asset.query";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@components/ui/input";
import { toast } from "react-toastify";
import {
    Select, SelectTrigger, SelectValue,
} from "@components/ui/select";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useRouter } from "next/navigation";
import Category from './category';
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import DetailModal from '@components/modal';
import { usePushUp } from '../pushUp';


enum State {
    AVAILABLE = "AVAILABLE",
    NOT_AVAILABLE = "NOT_AVAILABLE"
}

interface FormData {
    name: string;
    categoryId: string;
    specification: string;
    installedDate: string;
    state: State;
}
const FormCreateAsset = () => {
    const [createAssetMutation] = useMutation(CREATE_ASSET_MUTATION);
    const [showModalCancel, setShowModalCancel] = useState(false);
    const { setLoading }: any = useLoading();
    const router = useRouter();
    const {pushUp}: any = usePushUp()

    const form = useForm<FormData>({
        mode: "onChange",
        defaultValues: {
            name: "",
            categoryId: "",
            specification: "",
            installedDate: "",
            state: State.AVAILABLE,
        },
    });

    const handleCloseCancelModal = () => {
        setShowModalCancel(false);
    };

    const handleDiscard = () => {
        form.reset();
        setShowModalCancel(false);
        router.push("/asset");
    };
    const allFieldsFilled = !!form.watch("name") &&
        !!form.watch("categoryId") &&
        !!form.watch("specification") &&
        !!form.watch("installedDate") &&
        (!!form.watch("state"));

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const variables = {
                createAssetInput: {
                    assetName: data.name,
                    categoryId: parseInt(data.categoryId),
                    specification: data.specification,
                    installedDate: data.installedDate,
                    state: data.state,
                },
            };

            const response = await createAssetMutation({ variables });

            if (response.errors) {
                response.errors.forEach((error: any) => {
                    console.error(`GraphQL error message: ${error.message}`);
                });
                toast.error("Error creating asset");
            } else {
                const assetId = response.data.createAsset.id;
                pushUp(parseInt(assetId))
                toast.success("Asset created successfully");
                router.push('/asset');
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again");
            console.error('Error creating asset:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
        <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <div className="flex items-center gap-5">
                                <FormLabel className="w-[150px]">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        {...field}
                                        className={`cursor-pointer ${fieldState.error ? "border-nashtech" : ""
                                            }`}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage className="text-nashtech float-left ml-26">
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <div className="flex items-center gap-5">
                                <FormLabel className="w-[150px]">Category</FormLabel>
                                <FormControl>
                                    <>
                                        <Select
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue
                                                    className="cursor-pointer"
                                                    ref={field.ref}
                                                />
                                            </SelectTrigger>
                                            <Category />
                                        </Select>
                                    </>
                                </FormControl>
                            </div>
                            <FormMessage className="text-nashtech float-left ml-26">
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="specification"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <div className="flex items-start gap-5">
                                <FormLabel className="w-[150px]">Specification</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        className={`h-[100px] flex justify-end cursor-pointer flex-col ${fieldState.error ? "border-nashtech" : ""
                                            }`}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage className="text-nashtech float-left ml-26">
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="installedDate"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <div className="flex items-center gap-5">
                                <FormLabel className="w-[150px]">Installed Date</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        {...field}
                                        type="date"
                                        className={`flex justify-end cursor-pointer flex-col ${fieldState.error ? "border-nashtech" : ""}`}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage className="text-nashtech float-left ml-26">
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <Controller
                    control={form.control}
                    name="state"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <div className="flex">
                                <FormLabel className="w-[110px]">State</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        {...field}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="cursor-pointer">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={State.AVAILABLE} id="option-one"
                                            className={field.value === State.AVAILABLE ? "focus:ring text-nashtech" : ""}
                                            />
                                            <Label htmlFor="option-one" >Available</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={State.NOT_AVAILABLE}
                                                id="option-two"
                                                className={field.value === State.NOT_AVAILABLE ? "focus:ring text-nashtech" : ""}
                                            />
                                            <Label htmlFor="option-two">Not Available</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <FormMessage className="text-nashtech float-left ml-26">
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <div className="float-right">
                    <Button
                        type="submit"
                        className="bg-nashtech text-white mr-4 cursor-pointer"
                        disabled={!allFieldsFilled}
                    >
                        Save
                    </Button>
                    <Button type="button" onClick={() => setShowModalCancel(true)}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
        <DetailModal
                isOpen={showModalCancel}
                onClose={handleCloseCancelModal}
                title="Are you sure">
                <div className="bg-white sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <p className="text-md text-gray-500">
                                Do you want to cancel changes?
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 sm:flex sm:flex-row-reverse gap-4">
                    <Button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setShowModalCancel(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDiscard}>
                        Discard
                    </Button>
                </div>
            </DetailModal>
        </>
    )
}

export default FormCreateAsset