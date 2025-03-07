import { FC, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Dialog, Transition } from "@headlessui/react";
import { IProjectView } from "@plane/types";
// ui
import { TOAST_TYPE, setToast } from "@plane/ui";
// components
import { ProjectViewForm } from "@/components/views";
// hooks
import { useProjectView } from "@/hooks/store";
// types

type Props = {
  data?: IProjectView | null;
  isOpen: boolean;
  onClose: () => void;
  preLoadedData?: Partial<IProjectView> | null;
  workspaceSlug: string;
  projectId: string;
};

export const CreateUpdateProjectViewModal: FC<Props> = observer((props) => {
  const { data, isOpen, onClose, preLoadedData, workspaceSlug, projectId } = props;
  // store hooks
  const { createView, updateView } = useProjectView();

  const handleClose = () => {
    onClose();
  };

  const handleCreateView = async (payload: IProjectView) => {
    await createView(workspaceSlug, projectId, payload)
      .then(() => {
        handleClose();
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Success!",
          message: "View created successfully.",
        });
      })
      .catch(() =>
        setToast({
          type: TOAST_TYPE.ERROR,
          title: "Error!",
          message: "Something went wrong. Please try again.",
        })
      );
  };

  const handleUpdateView = async (payload: IProjectView) => {
    await updateView(workspaceSlug, projectId, data?.id as string, payload)
      .then(() => handleClose())
      .catch((err) =>
        setToast({
          type: TOAST_TYPE.ERROR,
          title: "Error!",
          message: err.detail ?? "Something went wrong. Please try again.",
        })
      );
  };

  const handleFormSubmit = async (formData: IProjectView) => {
    if (!data) await handleCreateView(formData);
    else await handleUpdateView(formData);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-custom-backdrop transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="my-10 flex items-center justify-center p-4 text-center sm:p-0 md:my-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-custom-background-100 px-5 py-8 text-left shadow-custom-shadow-md transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <ProjectViewForm
                  data={data}
                  handleClose={handleClose}
                  handleFormSubmit={handleFormSubmit}
                  preLoadedData={preLoadedData}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});
