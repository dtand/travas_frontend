package gsplatform.logging;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

public class Constants{

	/**
	* Path to properties file
	**/
	public static final String filepath = "usr/local/applogs/travas/constants.properties";
	
	/**
	* Path to api logger file - logs all API requests and responses
	**/
	private String apiLogPath;
	
	/**
	* Path to api exceptions logger file - logs all exceptions from API calls
	**/
	private String apiExceptionsLogPath;
	
	/**
	* Path to trading bots logger - logs all trading bot actions
	**/
	private String botsLogPath;
	
	/**
	* Path to bot exceptions - logs all trading bot exceptions
	**/
	private String botExceptionsLogPath;
	
	/**
	* Path to simulations logger - logs all bot simulation actions
	**/
	private String simulationsLogPath;
	
	/**
	* Path to simulation exceptions - logs all exceptions from simulations
	**/
	private String simulationExceptionsLogPath;
	
	/**
	* Path to bot threads - logs creation, deletion, adds and removal to all bot threads
	**/
	private String botThreadsLogPath;
	
	/**
	* Key used to decrypt json sent from login
	**/
	private String masterKey;
	
	/**
	* Key used to access the nomics API
	**/
	private String nomicsApiKey;
	
	/**
	* How long does the log manager wait before writing queue of logs
	**/
	private int loggerQueueDelay;
	
	/**
	* The database to use for the platform (web app)
	**/
	private String platformDatabase;
	
	/**
	* User to use for querying
	**/
	private String platformDatabaseUser;
	
	/**
	* Password to access database
	**/
	private String platformDatabasePassword;
	
	/**
	* Mirror database that holds subset of nomics data
	**/
	private String nomicsMirrorDatabase;
	
	/**
	* User for nomics mirror
	**/
	private String nomicsMirrorDatabaseUser;
	
	/**
	* Password for nomics mirror
	**/
	private String nomicsMirrorDatabasePassword;
	
	/**
	 * Redirect URI for after login
	 */
	private String redirectAfterLogin;
	
	/**
	* Singleton reference
	**/
	private static Constants constants = new Constants( );
	
	/**
	 * Singleton access
	 * @return singleton
	 */
	public static Constants instance() {
		return constants;
	}
	
	
	/**
	* Grabs and sets all constants for platform
	**/
	public Constants(){
		
		Properties properties = new Properties( );
		File propertiesFile   = new File( filepath );
		
		if( propertiesFile.exists( ) )
		{
			System.out.println( "LOADING PLATFORM PROPERTIES FROM " + filepath );
			
			FileInputStream fileInputStream = null;
			
			try
			{
				fileInputStream = new FileInputStream( propertiesFile );
				properties.load( fileInputStream );
				fileInputStream.close( );
				loadConstants( properties );
			}
			catch( Exception e )
			{
				e.printStackTrace( ); 
			}
		}
		else
		{
			System.out.println( "PROPERTIES FILE DOES NOT EXIST, PLEASE CREATE PROPERTIES FILE AT LOCATION: " + filepath );
		}
		
	}
	
	/**
	* Internal method to load all constants
	**/
	private void loadConstants( Properties properties )
	{
		this.apiLogPath 						= properties.getProperty( "apiLogPath" );
		this.apiExceptionsLogPath 			= properties.getProperty( "apiExceptionsLogPath" );
		this.botsLogPath 					= properties.getProperty( "botsLogPath" );
		this.botExceptionsLogPath 			= properties.getProperty( "botExceptionsLogPath" );
		this.simulationsLogPath 				= properties.getProperty( "simulationsLogPath" );
		this.simulationExceptionsLogPath 	= properties.getProperty( "simulationExceptionsLogPath" );
		this.botThreadsLogPath 				= properties.getProperty( "botThreadsLogPath" );
		this.masterKey						= properties.getProperty( "masterKey" );
		this.nomicsApiKey 					= properties.getProperty( "nomicsApiKey" );
		this.loggerQueueDelay				= Integer.valueOf( properties.getProperty( "loggerQueueDelay" ) );
		this.platformDatabase				= properties.getProperty( "platformDatabase" );
		this.platformDatabaseUser 			= properties.getProperty( "platformDatabaseUser" );
		this.platformDatabasePassword 		= properties.getProperty( "platformDatabasePassword" );
		this.nomicsMirrorDatabase			= properties.getProperty( "nomicsMirrorDatabase" );
		this.nomicsMirrorDatabaseUser 		= properties.getProperty( "nomicsMirrorDatabaseUser" );
		this.nomicsMirrorDatabasePassword 	= properties.getProperty( "nomicsMirrorDatabasePassword" );
		this.redirectAfterLogin          	= properties.getProperty( "redirectAfterLogin" );
	}
	
	public static String getFilepath() {
		return filepath;
	}

	public String getApiLogPath() {
		return apiLogPath;
	}

	public String getApiExceptionsLogPath() {
		return apiExceptionsLogPath;
	}

	public String getBotsLogPath() {
		return botsLogPath;
	}

	public String getBotExceptionsLogPath() {
		return botExceptionsLogPath;
	}

	public String getSimulationsLogPath() {
		return simulationsLogPath;
	}

	public String getSimulationExceptionsLogPath() {
		return simulationExceptionsLogPath;
	}

	public String getBotThreadsLogPath() {
		return botThreadsLogPath;
	}

	public String getMasterKey() {
		return masterKey;
	}

	public String getNomicsApiKey() {
		return nomicsApiKey;
	}

	public int getLoggerQueueDelay() {
		return loggerQueueDelay;
	}

	public String getPlatformDatabase() {
		return platformDatabase;
	}

	public String getPlatformDatabaseUser() {
		return platformDatabaseUser;
	}

	public String getPlatformDatabasePassword() {
		return platformDatabasePassword;
	}

	public String getNomicsMirrorDatabase() {
		return nomicsMirrorDatabase;
	}

	public String getNomicsMirrorDatabaseUser() {
		return nomicsMirrorDatabaseUser;
	}

	public String getNomicsMirrorDatabasePassword() {
		return nomicsMirrorDatabasePassword;
	}
	
	public String redirectAfterLogin() {
		return redirectAfterLogin;
	}
	

}
