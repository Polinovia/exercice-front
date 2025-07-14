<?php
define('DEBUG',true); //nom toujour en majiscule
define('ROOT',"http://localhost:8888/front_quiestla");
//const DEBUG = true;

//guestion connection DB
$_ENV = parse_ini_file('.env');

try {
  $db = new PDO(
    sprintf('mysql:host=%s;dbname=%s;charset=utf8',$_ENV['DB_HOST'], $_ENV['DB_NAME']),
    $_ENV['DB_USER'],
   $_ENV['DB_PASSWORD']
  );
 $db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (Exception $e) {
  die ('Erreur : ' . $e -> getMessage());
}

//print_r($db);