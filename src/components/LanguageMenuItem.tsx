import { Icon, MenuItem, useDisclosure } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { LanguageIcon } from "../icons";
import { LanguageDialog } from "./LanguageDialog";

interface LanguageMenuItemProps {
  finalFocusRef: React.RefObject<HTMLButtonElement>;
}

const LanguageMenuItem = ({ finalFocusRef }: LanguageMenuItemProps) => {
  const languageDisclosure = useDisclosure();

  return (
    <>
      <LanguageDialog
        isOpen={languageDisclosure.isOpen}
        onClose={languageDisclosure.onClose}
        finalFocusRef={finalFocusRef}
      />
      <MenuItem
        icon={<Icon h={5} w={5} as={LanguageIcon} />}
        onClick={languageDisclosure.onOpen}
      >
        <FormattedMessage id="language" />
      </MenuItem>
    </>
  );
};

export default LanguageMenuItem;
