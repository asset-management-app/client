/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItems,
  Transition,
} from "@headlessui/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Fragment, useEffect, useState } from "react";
import { useAuth } from "@providers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailModal from "@components/modal";
import { useLoading } from "@providers/loading";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { USER } from "../../constants";
import { Button } from "@components/ui/button";
import { changePassword, logout } from "@services/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import { UserStoreType } from "../../types/user.type";

// Define the User type based on your application's user structure
const Navbar = () => {
  const { activeItem } = useAuth();
  const { setLoading }: any = useLoading();
  const route = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [confirmLogout, setConformLogout] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [errorMsg, setErrorMsg] = useState("");
  const [userCurrent, setUserCurrent] = useState<UserStoreType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER);
    if (storedUser) {
      setUserCurrent(JSON.parse(storedUser));
      setLoading(false);
    }
  }, []);

  const handleCloseDetailModal = () => {
    setIsOpenModal(false);
    setConformLogout(false);
  };
  const handleOpenDetailModal = () => {
    setIsOpenModal(true);
  };
  const handleOpenConfirm = () => {
    setConformLogout(true);
  };
  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await changePassword(
        oldPassword as string,
        newPassword as string
      );
      if (result) {
        route.push("/login");
        setLoading(false);
      }
    } catch (error: any) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const result = await logout();
      if (result) {
        setLoading(false);
        route.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderName = () => {
    let result = activeItem?.name;
    
    if(pathname.includes("/create")){
      result = `${activeItem?.name} > Create new ${activeItem?.component} `
    }
    if(Object.keys(params).length > 0){
      result = `${activeItem?.name} > Edit ${activeItem?.component} `
    }
    return (
      <>
        {result}
      </>
    )
  }

  return (
    <>
      <Disclosure as="nav" className="bg-nashtech text-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between font-bold">
            <div>{activeItem ? renderName() : ""}</div>
            <div className="relative">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex justify-center w-full px-4 py-2 bg-nashtech text-sm font-medium text-white hover:bg-gray-700 focus:outline-none">
                    {userCurrent?.username} <ArrowDropDownIcon />
                  </MenuButton>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <MenuItems className="absolute right-0 mt-2 w-60 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-3 flex justify-center flex-col">
                      <Button
                        variant="ghost"
                        className="hover:bg-nashtech hover:text-white text-black text-sm rounded px-2 cursor-pointer mb-2"
                        onClick={handleOpenDetailModal}>
                        Change Password
                      </Button>
                      <Button
                        variant="ghost"
                        className="hover:bg-nashtech hover:text-white text-black text-sm rounded cursor-pointer px-2"
                        onClick={handleOpenConfirm}>
                        Logout
                      </Button>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </Disclosure>
      <DetailModal
        isOpen={isOpenModal}
        onClose={() => {}}
        isShowCloseIcon={false}
        title="Change Password">
        <div>
          <form
            className="w-full p-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
            <div className="md:flex md:items-center mb-3 relative">
              <div className="md:w-1/3">
                <label className="block text-gray-700 mb-1 md:mb-0 pr-4">
                  Old Password
                </label>
              </div>
              <div className="md:w-2/3 relative">
                <input
                  className="border border-black rounded w-full py-1 px-4"
                  id="inline-password"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value), setErrorMsg("");
                  }}
                />
                <button
                  type="button"
                  onClick={toggleShowOldPassword}
                  className="absolute right-0 top-0 mt-1 mr-2 text-gray-600 focus:outline-none">
                  <FontAwesomeIcon
                    icon={showOldPassword ? faEye : faEyeSlash}
                  />
                </button>
              </div>
            </div>
            <div className="md:flex md:items-center mb-3 relative">
              <div className="md:w-1/3">
                <label className="block text-gray-700 mb-1 md:mb-0 pr-4">
                  New Password
                </label>
              </div>
              <div className="md:w-2/3 relative">
                <input
                  className="border border-black rounded w-full py-1 px-4"
                  id="inline-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value), setErrorMsg("");
                  }}
                />
                <button
                  type="button"
                  onClick={toggleShowNewPassword}
                  className="absolute right-0 top-0 mt-1 mr-2 text-gray-600 focus:outline-none">
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEye : faEyeSlash}
                  />
                </button>
              </div>
            </div>
            <div className="h-5">
              <span className="text-nashtech text-xs italic">{errorMsg}</span>
            </div>

            <div className="flex flex-row-reverse mt-2 gap-5">
              <Button
                variant="outline"
                onClick={handleCloseDetailModal}
                type="button">
                Cancel
              </Button>
              <Button
                className={`bg-nashtech text-white py-1 px-3 rounded ${
                  !oldPassword && !newPassword
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-75"
                }`}
                disabled={!oldPassword && !newPassword}
                type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      </DetailModal>
      <DetailModal
        isOpen={confirmLogout}
        onClose={() => {}}
        isShowCloseIcon={false}
        title="Are you sure ?">
        <div>
          <div>Do you want to logout ?</div>
          <div className="flex flex-row justify-center gap-3 mt-10">
            <Button
              onClick={handleLogout}
              className="bg-nashtech text-white hover:opacity-75">
              Logout
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseDetailModal}
              type="button">
              Cancel
            </Button>
          </div>
        </div>
      </DetailModal>
    </>
  );
};

export default Navbar;
