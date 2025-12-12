import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  //states
  const [taskBuffer, setTaskBuffer] = useState([]); //tạo state để lưu ds nhiệm vụ
  const [activeTaskCount, setActiveTaskCount] = useState(0); //tạo state để lưu số nhiệm vụ đang hoạt động
  const [completeTaskCount, setCompleteTaskCount] = useState(0); //tạo state để lưu số nhiệm vụ đã hoàn thành
  const [filter, setFilter] = useState("all"); //tạo state để lưu bộ lọc nhiệm vụ
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  //gọi API lấy ds nhiệm vụ khi component được render lần đầu
  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  //viết hàm gọi API và lấy ds nhiệm vụ (logic)
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };

  //
  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // biến lưu danh sách nhiệm vụ đã lọc
  const filteredTasks = Array.isArray(taskBuffer)
    ? taskBuffer.filter((task) => {
        switch (filter) {
          case "active":
            return task.status === "active";
          case "completed":
            return task.status === "completed";
          default:
            return true; //giữ nguyên tất cả nhiệm vụ, không lọc gì hết
        }
      })
    : [];

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  if (visibleTasks.length === 0) handlePrev();

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Grid + Left & Right Gradient Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
       linear-gradient(to right, #f0f0f0 1px, transparent 1px),
       linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
       radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
       radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
     `,
          backgroundSize: `
       96px 64px,    
       96px 64px,    
       100% 100%,    
       100% 100%  
     `,
        }}
      />
      {/* Your Content/Components */}
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Đầu trang  */}
          <Header />
          {/* Tạo nhiệm vụ */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />
          {/* Thống kê và bộ lọc */}
          <StatsAndFilters
            activeTasksCount={activeTaskCount}
            completedTaskCount={completeTaskCount}
            filter={filter}
            setFilter={setFilter}
          />
          {/* Danh sách nhiệm vụ */}
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />
          {/* Phân trang và lọc theo ngày */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          {/* Chân trang */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
