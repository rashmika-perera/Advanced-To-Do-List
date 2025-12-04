import "@fontsource/poppins/500.css";
import { FaPlus, FaAngleRight } from "react-icons/fa6";
import Navigation from "../SideNavigation/Navigation";
import { FaCalendarTimes } from "react-icons/fa";
import Task from "../Tasks/Task";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase";
import { auth } from "../../Firebase";
import { onAuthStateChanged } from "firebase/auth";

type TaskToEdit = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  color: string;
  name: string;
};

const Upcoming = () => {
  const [showTasks, setShowTasks] = useState(false);
  const [borderWidth, setBorderWidth] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskToEdit | null>(null);
  const [addTask, setAddTask] = useState<TaskToEdit[]>([]);
  const todayDate = new Date().toLocaleDateString("en-CA");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const tasksRef = query(
        collection(db, "users", user.uid, "tasks"),
        orderBy("createdAt", "desc")
      );

      const unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => {
          const data = doc.data();
          let dueDateString = "";
          if (data.dueDate) {
            try {
              dueDateString = data.dueDate.toDate().toLocaleDateString("en-CA");
            } catch {
              dueDateString = "";
            }
          }
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            dueDate: dueDateString,
            color: data.listColor || "#ccc",
            name: data.listName,
          };
        });
        setAddTask(tasks);
        setLoading(false);
      });

      return () => unsubscribeTasks();
    });

    return () => unsubscribeAuth();
  }, []);

  const upcomingTasks = addTask.filter((task) => task.dueDate > todayDate);
  const todayTasks = addTask.filter((task) => task.dueDate === todayDate);

  const handleDeleteTask = async (taskId: string) => {
    setAddTask((prev) => prev.filter((task) => task.id !== taskId));

    try {
      const user = auth.currentUser;
      if (!user) return;

      setTimeout(async () => {
        await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
        console.log("Document deleted with ID:", taskId);
      }, 300);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const newTask = () => {
    setTaskToEdit(null);
    setShowTasks(true);
    setBorderWidth(true);
  };

  const handleTaskClick = (task: (typeof addTask)[number]) => {
    setTaskToEdit(task);
    setShowTasks(true);
    setBorderWidth(true);
  };

  const handleClose = () => {
    setShowTasks(false);
  };

  const handleExitComplete = () => {
    setBorderWidth(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading your tasks...
      </div>
    );
  }

  return (
    <div className="flex pt-5 overflow-x-hidden pl-5">
      <Navigation today={todayTasks.length} upcoming={upcomingTasks.length} />
      <div className="flex overflow-x-hidden pl-[280px]">
        <div className="pl-8">
          <div className="flex flex-row justify-left items-center h-14">
            <h1
              className="md:text-4xl font-bold text-gray-800"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Upcoming
            </h1>
            <div className="flex justify-center items-center ml-7 border-1 border-gray-300 rounded-[10px] w-10 h-10">
              <h1
                className="md:text-3xl text-gray-800"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {upcomingTasks.length}
              </h1>
            </div>
          </div>
          <div className="mt-5">
            <div className="mt-2">
              <button
                className={`flex flex-row justify-left w-227 ${
                  borderWidth ? "w-[572px]" : "w-227"
                } items-center mt-2 md:text-sm text-gray-400 hover:text-[#11110f] select-none border border-gray-200 hover:border-gray-400 mb-4 rounded-[8px] h-12 px-5`}
                onClick={newTask}
              >
                <span className="flex flex-row items-center gap-3">
                  <FaPlus />
                  Add New Task
                </span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {upcomingTasks.map((item) => (
              <motion.div
                key={item.id}
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ x: 200, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="group flex flex-row justify-center gap-3 pl-5 items-center mt-2">
                  <div>
                    <input
                      type="checkbox"
                      className="w-[15px] h-[15px] border border-gray-400 rounded-sm"
                      onChange={() => handleDeleteTask(item.id)}
                    />
                  </div>
                  <button
                    onClick={() => handleTaskClick(item)}
                    className="w-full"
                  >
                    <div className="flex flex-col items-start">
                      <h1
                        className="md:text-[12px] text-gray-800 font-normal"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.title}
                      </h1>
                      <p
                        className="md:text-[11px] text-gray-500 font-normal"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </button>
                  <div className="flex flex-row justify-end ml-auto">
                    <FaAngleRight className="text-gray-400 text-lg group-hover:text-gray-600" />
                  </div>
                </div>
                <div className="flex flex-row justify-start gap-3 pl-12 items-center mt-2">
                  <div className="flex flex-row gap-2">
                    <FaCalendarTimes className="text-gray-500 text-xs" />
                    <span
                      className="md:text-[11px] text-gray-800 font-normal"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.dueDate}
                    </span>
                  </div>
                  <div>
                    <div className="h-5 w-[2px] bg-gray-200 mx-2"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-[4px] border border-gray-300"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span
                      className="text-[11px] font-semibold text-gray-700"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.name || "No List"}
                    </span>
                  </div>
                </div>
                <div>
                  <hr className="my-2 text-gray-200 border-t-2" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence onExitComplete={handleExitComplete}>
          {showTasks && (
            <motion.div
              initial={{ opacity: 1, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.1 }}
              className="ml-4 overflow-y-auto h-screen max-h-[calc(100vh-2.5rem)]"
            >
              <Task onClose={handleClose} taskToEdit={taskToEdit} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Upcoming;
