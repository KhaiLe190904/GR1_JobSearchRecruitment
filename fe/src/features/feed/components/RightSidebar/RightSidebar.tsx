import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { IUser } from "../../../authentication/context/AuthenticationContextProvider";
import { IConnection } from "../../../networking/components/Connection/Connection";
import classes from "./RightSidebar.module.scss";
import { Button } from "../../../authentication/components/Button/Button";
export function RightSidebar() {
  const [suggestions, setSuggestions] = useState<IUser[]>([]);

  useEffect(() => {
    request<IUser[]>({
      endpoint: "/api/v1/networking/suggestions",
      onSuccess: (data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setSuggestions(shuffled.slice(0, 2));
      },
      onFailure: (error) => console.log(error),
    });
  }, []);

  return (
    <div className={classes.root}>
      <h3>Add to your connexions</h3>
      <div className={classes.items}>
        {suggestions.map((suggestion) => {
          return (
            <div className={classes.item} key={suggestion.id}>
              <img
                src={suggestion.profilePicture || "/doc1.png"}
                alt=""
                className={classes.avatar}
              />
              <div className={classes.content}>
                <div className={classes.name}>
                  {suggestion.firstName} {suggestion.lastName}
                </div>
                <div className={classes.title}>
                  {suggestion.position} at {suggestion.company}
                </div>
                <Button
                  size="medium"
                  outline
                  className={classes.button}
                  onClick={() => {
                    request<IConnection>({
                      endpoint: "/api/v1/networking/connections?recipientId=" + suggestion.id,
                      method: "POST",
                      onSuccess: () => {
                        setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));
                      },
                      onFailure: (error) => console.log(error),
                    });
                  }}
                >
                  + Connect
                </Button>
              </div>
            </div>
          );
        })}

        {suggestions.length === 0 && (
          <div className={classes.empty}>
            <p>No suggestions at the moment :(</p>
          </div>
        )}
      </div>
    </div>
  );
}