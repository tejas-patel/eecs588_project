<?php
	include_once "global_var.php";
	
	function update_cookie_property(){
		global $cookie_cross;
		$value_pairs = array();
		foreach( $cookie_cross as $k => $v){
			if($v == true){
				$value_pairs[] = "$k=sameorigin";
			} else{
				$value_pairs[] = "$k=crossorigin";
			}
		}
		$header_value = join("; ", $value_pairs);
		header("Cookie-Property: ".$header_value);	
	}

	function setcookiecross($name, $value, $expire, $path, $domain, $secure, $httponly, $same){
		global $cookie_cross;
		$cookie_cross[$name] = $same;

		setcookie($name, $value, $expire, $path, $domian, $secure, $httponly);
		update_cookie_property();
	}

?>