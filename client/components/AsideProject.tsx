import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

type ProjectType = {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  role: "member" | "admin";
  project: {
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    categories: {
      uuid: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      color: string;
    }[];
  };
};

interface Props {
  projectMember: ProjectType;
}

const AsideProject: React.FC<Props> = ({ projectMember }) => {
  const [expand, setExpand] = useState<boolean>(false);

  useEffect(() => {
    setExpand(false);
  }, [projectMember]);

  return (
    <React.Fragment>
      <div className="project-container">
        <div>
          <div
            className="icon"
            onClick={() => {
              setExpand((prevState) => !prevState);
              const categoriesNode = document.getElementById("categories") as HTMLUListElement;
            }}
          >
            <FontAwesomeIcon
              icon={faCaretRight}
              height={"15px"}
              color={"grey"}
              style={{ transition: "transform 0.2s" }}
              rotation={expand ? 90 : null}
            />
          </div>
          <li className="project-name">{projectMember.project.name}</li>
        </div>
        <ul className="categories" id="categories">
          {projectMember.project.categories.map((category) => (
            <li key={category.uuid} className="category">
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .project-container > div {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .icon {
          height: 30px;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .project-name {
          color: #939bac;
          margin: 5px;
          font-size: 0.8rem;
          cursor: pointer;
          list-style: none;
        }

        .categories {
          margin-left: 35px;
          margin-top: -5px;
          display: ${expand ? "block" : "none"};
        }

        .category {
          font-size: 0.8rem;
          color: #808ca5;
          margin: 10px 0;
          cursor: pointer;
          text-transform: capitalize;
        }
      `}</style>
    </React.Fragment>
  );
};

export default AsideProject;
