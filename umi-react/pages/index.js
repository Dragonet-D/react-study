import {useState} from "react";
import styles from './index.css';

export default function () {
  const [value] = useState(1);
  return (
    <div className={styles.normal}>
      <h1>Page index{value}</h1>
    </div>
  );
}
