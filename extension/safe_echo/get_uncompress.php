<?php
header("Content-Encoding: none");
session_start();
$id = $_POST["uniq_id"];
echo $_SESSION[$id];
?>