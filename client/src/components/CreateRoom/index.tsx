import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { CreateChatRoomInput } from "../../__generated__/operations-types";
import Input from "../Input";

interface Props {
  onAddNewRoom: (input: CreateChatRoomInput) => void;
}

const CreateRoom = ({ onAddNewRoom }: Props) => {
  const [newRoom, setNewRoom] = useState<CreateChatRoomInput>({
    title: "",
    description: "",
  });

  const handleChangeInput = (value: string, name: string) => {
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleAddNewRoom = () => {
    onAddNewRoom({ title: newRoom.title, description: newRoom.description });
  };

  return (
    <div>
      <Input
        name="title"
        placeholder="title"
        value={newRoom.title}
        onChange={handleChangeInput}
      />
      <Input
        name="description"
        placeholder="description"
        value={newRoom.description}
        onChange={handleChangeInput}
      />
      <Button onClick={handleAddNewRoom}>Add New Room</Button>
    </div>
  );
};

export default CreateRoom;
