import { useEffect, useState } from "react";
import { Input } from "../../../../components/Input/Input";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/context/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import classes from "./Header.module.scss";
import { Button } from "../../../authentication/components/Button/Button";
interface ITopProps {
  user: IUser | null;
  authUser: IUser | null;
  onUpdate: (user: IUser) => void;
}
export function Header({ user, authUser, onUpdate }: ITopProps) {
  const [editingInfo, setEditingInfo] = useState(false);
  const [info, setInfo] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    position: user?.position,
    company: user?.company,
    location: user?.location,
  });
  const [connexions, setConnections] = useState<IConnection[]>([]);
  const [invitations, setInvitations] = useState<IConnection[]>([]);
  const connection =
    connexions.find((c) => c.recipient.id === user?.id || c.author.id === user?.id) ||
    invitations.find((c) => c.recipient.id === user?.id || c.author.id === user?.id);

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections",
      onSuccess: (data) => setConnections(data),
      onFailure: (error) => console.log(error),
    });
  }, []);

  useEffect(() => {
    request<IConnection[]>({
      endpoint: "/api/v1/networking/connections?status=PENDING",
      onSuccess: (data) => setInvitations(data),
      onFailure: (error) => console.log(error),
    });
  }, [user?.id]);

  async function updateInfo() {
    await request<IUser>({
      endpoint: `/api/v1/authentication/profile/${user?.id}?firstName=${info.firstName}&lastName=${info.lastName}&position=${info.position}&company=${info.company}&location=${info.location}`,
      method: "PUT",
      onSuccess: (data) => {
        onUpdate(data);
        setEditingInfo(false);
      },
      onFailure: (error) => console.log(error),
    });
    setInfo({
      firstName: "",
      lastName: "",
      position: "",
      company: "",
      location: "",
    });
    setEditingInfo(false);
  }

  return (
    <div className={classes.top}>
      <img className={classes.cover} src={user?.coverPicture || "/cover.jpeg"} alt="" />

      <div className={classes.avatar}>
        <img src={user?.profilePicture || "/doc1.png"} alt="" />
      </div>

      <div className={classes.wrapper}>
        <div className={classes.info}>
          {!editingInfo ? (
            <div>
              <div className={classes.name}>{user?.firstName + " " + user?.lastName}</div>
              <div className={classes.title}>{user?.position + " at " + user?.company}</div>
              <div className={classes.location}>{user?.location}</div>

              {user?.id !== authUser?.id && (
                <>
                  {!connection ? (
                    <Button
                      size="medium"
                      outline
                      className={classes.connect}
                      onClick={() => {
                        request<IConnection>({
                          endpoint: "/api/v1/networking/connections?recipientId=" + user?.id,
                          method: "POST",
                          onSuccess: (data) => {
                            setInvitations([...invitations, data]);
                          },
                          onFailure: (error) => console.log(error),
                        });
                      }}
                    >
                      + Connect
                    </Button>
                  ) : (
                    <Button
                      size="medium"
                      outline
                      className={classes.connect}
                      onClick={() => {
                        request<IConnection>({
                          endpoint: `/api/v1/networking/connections/${connection?.id}`,
                          method: "DELETE",
                          onSuccess: () => {
                            setConnections((connections) =>
                              connections.filter((c) => c.id !== connection?.id)
                            );
                            setInvitations((invitations) =>
                              invitations.filter((c) => c.id !== connection?.id)
                            );
                          },
                          onFailure: (error) => console.log(error),
                        });
                      }}
                    >
                      {connection?.status === "ACCEPTED"
                        ? "Remove connection"
                        : authUser?.id === connection?.author.id
                        ? "Cancel invitation"
                        : "Ignore invitation"}
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div>
              {editingInfo && (
                <div className={classes.buttons}>
                  <button
                    onClick={() => {
                      setEditingInfo(false);
                      setInfo({
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        company: user?.company || "",
                        position: user?.position || "",
                        location: user?.location || "",
                      });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  </button>
                  <button onClick={updateInfo}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                    </svg>
                  </button>
                </div>
              )}
              <div className={classes.inputs}>
                <Input
                  value={info?.firstName}
                  onChange={(e) => setInfo({ ...info, firstName: e.target.value })}
                  placeholder="First name"
                />
                <Input
                  value={info?.lastName}
                  onChange={(e) => setInfo({ ...info, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
              <div className={classes.inputs}>
                <Input
                  value={info?.company}
                  onChange={(e) => setInfo({ ...info, company: e.target.value })}
                  placeholder="Company"
                />
                <Input
                  value={info?.position}
                  onChange={(e) => setInfo({ ...info, position: e.target.value })}
                  placeholder="Position"
                />
              </div>
              <Input
                value={info?.location}
                onChange={(e) => setInfo({ ...info, location: e.target.value })}
                placeholder="Location"
              />
            </div>
          )}
        </div>
        {authUser?.id == user?.id && !editingInfo && (
          <div className={classes.edit}>
            <button className={classes.edit} onClick={() => setEditingInfo(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}