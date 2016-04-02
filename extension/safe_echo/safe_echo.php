<?php
$id = 0;
$safe_out = array();
session_start();
register_shutdown_function('process_safe_echo');

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function safe_echo($string){
	global $id;
	global $safe_out;
	echo "<span data-safecompress-id=$id style='visibility:hidden'></span>";
	$safe_out["$id"] = $string;
	$id++;
}
function build_safe_string(){
	global $safe_out;
	$safe_val = array();
	foreach($safe_out as $k=>$v){
		$safe_val[] = "$k=$v";
	}
	$safe_header = join("; ", $safe_val);
	return $safe_header;

}

function process_safe_echo(){
	global $safe_out;
	$safe_header = build_safe_string();
	$uniq_id = uniqid();
	$_SESSION[$uniq_id] = json_encode($safe_out, JSON_FORCE_OBJECT);
	echo '<span id="safe-echo" style="visibility:hidden">'.$uniq_id.'</span>';
}
?>