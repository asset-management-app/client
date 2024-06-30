/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useDebouncedCallback } from "use-debounce";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { truncateParagraph } from "@utils/truncate";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { Button } from "@components/ui/button";
import SearchIcon from "@public/icon/search.svg";
import { useLoading } from "@providers/loading";

import { SORT_ORDER } from "../../../../types/enum.type";
import { Asset, FindAssetsInput } from "../../../../__generated__/graphql";
import { loadDataAsset } from "@services/asset";

interface ModalPickerProps {
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
  setAssetSelected: (value: Asset) => void;
}

const ModalPikcAsset: React.FC<ModalPickerProps> = ({
  isOpen,
  setOpenModal,
  setAssetSelected,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setLoading }: any = useLoading();
  const [selected, setSelected] = useState<Asset>();
  const [list, setList] = useState<Asset[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("assetCode");
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.ASC);

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
  }, 300);

  const handleSortClick = (item: any) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === item) {
      defaultOrder =
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    setSortOrder(defaultOrder);
    setSortBy(item);
  };

  const loadData = async (filter: FindAssetsInput) => {
    setLoading(true);
    const { data }: any = await loadDataAsset(filter);

    setList(data.assets);
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModal(false);
      }
    };
    if (isOpen) {
      loadData({
        page: 1,
        query: searchTerm,
        limit: 10,
        sortField: sortBy,
        sortOrder: sortOrder
      });

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, searchTerm, sortBy, sortOrder]);

  if (!isOpen) return null;

  const handleSelected = (item: Asset) => {
    setSelected(item);
  };

  const handleSave = () => {
    setAssetSelected(selected as Asset);
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-black shadow-lg w-auto h-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5">
          <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 text-nashtech font-bold">
                Select Asset
              </h3>
            </div>
            <div className="px-4 sm:px-6">
              <div className="relative w-52 h-full">
                <input
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  className="w-full pr-9 rounded border-solid border outline-none px-2 py-1 border-graycustom"
                />
                <button className="absolute top-0 p-2 h-full right-0 border-l-graycustom border-l">
                  <Image
                    src={SearchIcon}
                    width={15}
                    height={15}
                    alt={"search icon"}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-6 gap-4">
              <div></div>
              <div className="col border-b-2 border-black cursor-pointer" onClick={() => handleSortClick('assetCode')}>
                <span className="font-bold">
                  Asset Code{" "}
                  {sortBy === "assetCode" && sortOrder === SORT_ORDER.ASC ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </span>
              </div>
              <div className="col-span-3 border-b-2 border-black cursor-pointer" onClick={() => handleSortClick('assetName')}>
                <span className="font-bold">
                  Asset Name{" "}
                  {sortBy === "assetName" && sortOrder === SORT_ORDER.ASC ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </span>
              </div>
              <div className="border-b-2 border-black cursor-pointer" onClick={() => handleSortClick('categoryId')}>
                <span className="font-bold">
                  Category{" "}
                  {sortBy === "categoryId" && sortOrder === SORT_ORDER.ASC ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </span>
              </div>
              <div></div>
            </div>
            {list?.map((item, key) => (
              <div
                key={key}
                className="grid grid-cols-6 gap-4 cursor-pointer"
                onClick={() => handleSelected(item)}>
                <div className="flex justify-end items-center">
                  <label className="custom-radio">
                    <input
                      type="radio"
                      checked={selected?.id === item.id}
                      onChange={() => handleSelected(item)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="col border-b-2 border-graycustom">
                  <span>{item?.assetCode}</span>
                </div>
                <div className="col-span-3 border-b-2 border-graycustom">
                  <span>{truncateParagraph(item?.assetName, 20)}</span>
                </div>
                <div className="border-b-2 border-graycustom">
                  <span>{truncateParagraph(item?.category.categoryName, 10)}</span>
                </div>
                <div></div>
              </div>
            ))}
          </div>
          <div className="px-4 py-4 sm:px-6 flex justify-end gap-3">
            <Button
              disabled={!selected}
              className="bg-nashtech text-white"
              onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPikcAsset;
