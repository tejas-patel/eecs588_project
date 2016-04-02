<?php
	$score_header = array();
	session_start();
	ob_start();
	register_shutdown_function('process_safe_header');

	function set_score_property($property, $value ){
		global $score_header;
		$score_header[$property] = $value;
	}

	function process_safe_header(){
		global $score_header;
		$score_header_temp = array();
		foreach($score_header as $k=>$v){
			$score_header_temp[] = "$k=$v";
		}
		$score_header_final = join("; ",$score_header_temp);
		header("X-SCORE: $score_header_final");
		ob_end_flush();
	}


?>