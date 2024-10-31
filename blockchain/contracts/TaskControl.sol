// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract TaskContract {

  // 新しいタスクが追加されたときのイベント
  event AddTask(address recipient, uint taskId);
  // タスクが削除されたときのイベント
  event DeleteTask(uint taskId, bool isDeleted);

  // タスクの構造体を定義
  struct Task {
    uint id;                // タスクID
    address username;       // タスク作成者のアドレス
    string taskText;        // タスクの内容
    bool isDeleted;         // タスクが削除されているかどうかのフラグ
  }

  Task[] private tasks;  // タスクを保存する配列
  mapping(uint256 => address) taskToOwner;  // タスクIDから所有者をマッピング

  // タスクを追加する関数
  function addTask(string memory taskText, bool isDeleted) external {
    uint taskId = tasks.length;  // タスクIDは現在の配列の長さ
    tasks.push(Task(taskId, msg.sender, taskText, isDeleted));  // 新しいタスクを追加
    taskToOwner[taskId] = msg.sender;  // タスクの所有者を保存
    emit AddTask(msg.sender, taskId);  // イベントを発火
  }

  // 自分が作成したタスクを取得する関数
  function getMyTasks() external view returns (Task[] memory) {
    Task[] memory temporary = new Task[](tasks.length);  // 一時的なタスク配列を作成
    uint counter = 0;  // 結果に追加されるタスクの数

    for (uint i = 0; i < tasks.length; i++) {
      // 自分が作成したタスクで、削除されていないものを検索
      if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
        temporary[counter] = tasks[i];  // 見つかったタスクを一時配列に追加
        counter++;
      }
    }

    Task[] memory result = new Task[](counter);  // 実際に返却するタスク配列
    for (uint i = 0; i < counter; i++) {
      result[i] = temporary[i];  // 必要なタスクを結果配列にコピー
    }
    return result;
  }

  // タスクを削除する関数
  function deleteTask(uint taskId, bool isDeleted) external {
    // タスクの所有者が呼び出しを行っている場合のみ削除を許可
    if (taskToOwner[taskId] == msg.sender) {
      tasks[taskId].isDeleted = isDeleted;  // 削除フラグを更新
      emit DeleteTask(taskId, isDeleted);  // イベントを発火
    }
  }
}
