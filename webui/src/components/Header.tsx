import { TeamContext } from "@/lib/stores/teamContext";
import { AdminNavBar } from "@/pages/admin/navbar";
import { PublicNavBar } from "@/pages/navbar";
import { ActionIcon, Container, Flex, Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { BoxSelect } from "lucide-react";
import { useContext, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LeagueSelectionBox } from "./LeagueSelectionBox";

export const Header = () => {
  const onMobile = useMediaQuery("(max-width: 670px)");
  const location = useLocation();
  const { selectedLeague, chooseLeague } = useContext(TeamContext);
  const [opened, { open, close }] = useDisclosure(false);
  const onAdmin = useMemo(() => {
    return location.pathname.startsWith("/admin");
  }, [location]);
  const onBracket = useMemo(() => {
    return location.pathname.startsWith("/bracket");
  }, [location]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Select league to view" style={{ overflow: "visible" }}>
        <LeagueSelectionBox
          value={selectedLeague}
          onChange={chooseLeague}
          hideLabel
          readonly
          dropDownPosition="bottom"
        />
      </Modal>
      <Flex justify={"space-between"} align="center" bg="vek" p="md" className="header">
        <div className="logo">
          <img src={"/sss.png"} />
        </div>
        {onAdmin ? <AdminNavBar /> : <PublicNavBar />}
        {onMobile ? (
          <ActionIcon variant={"light"} color="white" onClick={open}>
            <BoxSelect size={18} />
          </ActionIcon>
        ) : (
          <LeagueSelectionBox value={selectedLeague} onChange={chooseLeague} hideLabel readonly />
        )}
      </Flex>
      {onBracket ? (
        <Outlet />
      ) : (
        <Container p={"xs"} size={"xl"}>
          <Outlet />
        </Container>
      )}
    </>
  );
};
