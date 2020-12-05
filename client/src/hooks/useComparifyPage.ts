import db from "../db";
import { useState, useEffect } from "react";
import { DB_COMPARIFYPAGE_COLLECTION } from "../constants";

export type ComparifyPage = {
  exists: boolean;
  id?: string;
  data?: firebase.firestore.DocumentData;
  // }
};

export default (comparifyPageID: string) => {
  const [comparifyPage, setComparifyPage] = useState<null | ComparifyPage>(
    null
  );
  useEffect(() => {
    const checkPageExistence = async () => {
      const pageRef = db
        .collection(DB_COMPARIFYPAGE_COLLECTION)
        .doc(comparifyPageID);
      const pageDoc = await pageRef.get();
      if (pageDoc.exists) {
        setComparifyPage({
          id: comparifyPageID,
          exists: true,
          data: pageDoc.data(),
        });
      } else {
        setComparifyPage({
          exists: false,
        });
      }
    };
    checkPageExistence();
  }, [comparifyPageID]);

  return comparifyPage;
};
