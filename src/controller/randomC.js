import process  from "process";

const obj = {};

function ramdom_numbers(numeros) {
  let random_numbers = Math.floor(Math.random() * 3000000) + 1;
  return random_numbers;
}

process.on("exit", () => {
  console.log(`Worker ${process.pid} exit`);
  console.log(obj);
});

process.on("message", (qty) => {
  let random_numbers = ramdom_numbers(qty);
  // Proceso iniciado
  console.log(`Worker ${process.pid} started`);
  // Envio los números al proceso padre
  process.send(random_numbers);
  // Proceso terminado
  console.log(`Worker ${process.pid} finished`);
  process.exit();
});
