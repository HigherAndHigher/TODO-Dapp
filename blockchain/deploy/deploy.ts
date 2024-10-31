import { ethers } from "hardhat";

const main = async () => {
  // コントラクトファクトリを取得し、デプロイ準備を行う
  const contractFactory = await ethers.getContractFactory("TaskContract");

  // コントラクトをデプロイし、完了を待つ
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();

  // デプロイ完了後のコントラクトアドレスを表示
  console.log("Contract deployed to:", contract.target);
};

// メイン関数を実行し、エラーハンドリングを行う
const runMain = async () => {
  try {
    await main();
    process.exit(0); // 成功時は正常終了
  } catch (error) {
    console.error(error); // エラー内容を出力
    process.exit(1); // エラー時は異常終了
  }
};

runMain();
