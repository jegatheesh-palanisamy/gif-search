import React, { useRef, useState } from "react";
import styles from "./Searchbar.module.scss";

interface ISearchbarProps {
  onSearch: (searchText: string) => void;
  delay?: number;
  placeholder?: string;
}

const Searchbar = ({
  onSearch,
  delay = 500,
  placeholder = "Search..."
}: ISearchbarProps) => {
  const timeoutId = useRef<number>();
  const [searchText, setSearchText] = useState("");

  const handleChange = (
    param: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    const nxtSearchText =
      typeof param === "string"
        ? param
        : (param as React.ChangeEvent<HTMLInputElement>).target.value;
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    setSearchText(nxtSearchText);
    timeoutId.current = setTimeout(onSearch, delay, nxtSearchText);
  };

  return (
    <div className={`${styles.container} position-relative w-100`}>
      <input
        type="text"
        className={`form-control pe-5 ${styles.searchbar}`}
        onChange={handleChange}
        value={searchText}
        placeholder={placeholder}
      />
      {
        Boolean(searchText) &&
        <div
          className={`${styles.searchClose} position-absolute fas fa-times-circle`}
          onClick={() => handleChange("")}
        >
          +
        </div>
      }
    </div>
  );
};

export default Searchbar;
