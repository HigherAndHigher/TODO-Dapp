import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("TaskContract", function () {
  let owner: any;
  let taskContract: any;

  // 合計タスク数の設定
  const NUM_TOTAL_TASKS = 5;
  let totalTasks: Array<{ taskText: string; isDeleted: boolean }>;

  // 各テスト実行前にコントラクトのデプロイと初期設定を行う
  beforeEach(async function () {
    // TaskContractのデプロイ準備
    const TaskContract = await ethers.getContractFactory("TaskContract");
    [owner] = await hre.ethers.getSigners(); // コントラクトデプロイ用の署名者を取得
    taskContract = await TaskContract.deploy(); // TaskContractのデプロイ

    // テスト用のタスクを事前に追加
    totalTasks = [];
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      const task = {
        taskText: `Task number: ${i}`,
        isDeleted: false,
      };
      await taskContract.addTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  });

  // タスク追加機能のテスト
  describe("Add Task", function () {
    it("AddTaskイベントが発火されるべき", async function () {
      const task = {
        taskText: "New Task",
        isDeleted: false,
      };
      await expect(taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, NUM_TOTAL_TASKS); // イベントに期待する引数を設定
    });
  });

  // 全タスク取得機能のテスト
  describe("Get All Tasks", function () {
    it("合計タスク数が正しく返されるべき", async function () {
      const tasksFromChain = await taskContract.getMyTasks();
      expect(tasksFromChain.length).to.equal(NUM_TOTAL_TASKS); // 合計タスク数が一致するか確認
    });
  });

  // タスク削除機能のテスト
  describe("Delete Task", function () {
    it("DeleteTaskイベントが発火されるべき", async function () {
      const TASK_ID = 0;
      const TASK_DELETED = true;

      await expect(taskContract.deleteTask(TASK_ID, TASK_DELETED))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(TASK_ID, TASK_DELETED); // イベントに期待する引数を設定
    });
  });

  // 必要に応じて追加のテストケースをここに追加
});
