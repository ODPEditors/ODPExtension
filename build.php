<?php
	/*
		This file is an ant script that list and compile the add-ons found in this directory
	*/
	//error_reporting(0);

	// Recursive function to list all files on a directory
	function list_directory($dir, &$list)
	{
		if ($dh = @opendir(dirname(__FILE__).'/'.$dir))
		{
			while($file = readdir($dh))
			{
				if( $file != "." and $file != "..")
				{
					if(!is_dir(dirname(__FILE__).'/'.$dir.$file))
					{
						$list[] = str_replace("\\", "/", $dir.$file);
					}
					if(is_dir(dirname(__FILE__).'/'.$dir.$file))
					{
						$newdir = $dir.$file."/";
						chdir(dirname(__FILE__).'/'.$newdir);
						list_directory($newdir, $list);
					}
				}
			}
			chdir("..");
		}
		return $list;
	}

	$root = dirname(__FILE__).'/';
	$extension = $root.'ODPExtension.xpi';
	@unlink($extension);

	$a = array();
	$list = list_directory('./', $a);

	$zip = new ZipArchive();
	if ($zip->open($extension, ZIPARCHIVE::CREATE)!==TRUE)
		die("cannot open <".$extension.">");
	//print_r($list);
	for($i=0;$i<count($list);$i++){
		if(strpos($list[$i], '.git') === false)
			$zip->addFile(realpath(dirname(__FILE__).'/'.$list[$i]),  preg_replace("~^\./~", '', $list[$i]));
	}
	$zip->close();

	sleep(1);//on MAC OS takes time to close the zip file

	echo "<script>window.open('./ODPExtension.xpi', '_top')</script>";
	echo "<script>close()</script>";
?>