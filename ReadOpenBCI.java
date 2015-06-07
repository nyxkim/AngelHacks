import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.lang.Math;

import javax.net.ssl.HttpsURLConnection;

public class ReadOpenBCI {

	final static boolean keepReading = true; 
	final static float ADS1299_Vref = 4.5f, ADS1299_gain = 24.0f;
	final static float scale_fac_uVolts_per_count = ADS1299_Vref / ((float)(Math.pow(2,23)-1)) 
			/ ADS1299_gain  * 1000000.f;

	public static void parseAndSend()
	{
		//Input file which needs to be parsed
		String fileToParse = "D:/AngelHacks/OpenBCI_Processing-master/OpenBCI_Processing-master/"
				+ "OpenBCI_GUI/SavedData/OpenBCI-Raw-test2.txt";
		BufferedReader fileReader = null;
		boolean skip = true;
		int counter = 0;
		float[][] eeg = new float [2][101];
		float avgOcc = 0, avgFron = 0;
		String toSend = "";

		//Delimiter used in CSV file
		final String DELIMITER = ", ";

		while (keepReading)
		{
			try
			{
				String line = "";
				//Create the file reader
				fileReader = new BufferedReader(new FileReader(fileToParse));

				while (skip)
				{
					fileReader.readLine(); fileReader.readLine(); fileReader.readLine(); 
					fileReader.readLine(); fileReader.readLine();
					skip = false;
				}
				

				//Read the file line by line
				while ((line = fileReader.readLine()) != null)
				{
					//Record channel 2 and 7 data. Rest not needed
					String[] tokens = line.split(DELIMITER);
					
					eeg[0][counter] = Math.abs((Float.parseFloat(tokens[2]))/scale_fac_uVolts_per_count);
					eeg[1][counter] = Math.abs((Float.parseFloat(tokens[7]))/scale_fac_uVolts_per_count);
					
					//Send average of 100 values to database
					if  (counter >= 100)
					{
						for (int i = 0; i<100; i++)
						{
							avgOcc += eeg[0][i];
							avgFron += eeg[1][i];
						}
						avgOcc = avgOcc/100;
						avgFron = avgFron/100;
						toSend = avgOcc + " " + avgFron;
						//System.out.println(toSend);
						//excutePost(toSend);
						
						counter = 0;
						
						Thread.sleep(1000/250);
					}
					else
						counter++;
						Thread.sleep(1000/250);
				}
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			finally
			{
				try {
	                fileReader.close();
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
			}
		}
	}

	public static void main (String args[])
	{
		parseAndSend();
	}
	
	public static String excutePost(String urlParameters) {
  	  HttpURLConnection connection = null;  
  	  try {
  	    //Create connection
  	    URL url = new URL("http://httpbin.org/post");
  	    //URL url = new URL("http://checkup.meteor.com/api/tps");
  	    connection = (HttpURLConnection)url.openConnection();
  	    connection.setRequestMethod("POST");
  	    connection.setRequestProperty("Content-Type", 
  	        "application/x-www-form-urlencoded");
  	    connection.setRequestProperty("test", "testing");

  	    connection.setRequestProperty("Content-Length", 
  	        Integer.toString(urlParameters.getBytes().length));
  	    connection.setRequestProperty("Content-Language", "en-US");  

  	    connection.setUseCaches(false);
  	    connection.setDoOutput(true);

  	    //Send request
  	    DataOutputStream wr = new DataOutputStream (
  	        connection.getOutputStream());
  	    wr.writeBytes(urlParameters);
  	    wr.close();

  	    //Get Response  
  	    InputStream is = connection.getInputStream();
  	    BufferedReader rd = new BufferedReader(new InputStreamReader(is));
  	    StringBuilder response = new StringBuilder(); // or StringBuffer if not Java 5+ 
  	    String line;
  	    while((line = rd.readLine()) != null) {
  	      response.append(line);
  	      response.append('\r');
  	    }
  	    rd.close();
  	    String res = response.toString();
  	    //System.out.println(res);
  	    return res;
  	  } catch (Exception e) {
  	    e.printStackTrace();
  	    return null;
  	  } finally {
  	    if(connection != null) {
  	      connection.disconnect(); 
  	    }
  	  }
  	}
}